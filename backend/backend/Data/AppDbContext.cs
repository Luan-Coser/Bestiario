using Microsoft.EntityFrameworkCore;
using BestiarioAPI.Models;

namespace BestiarioAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Tipo> Tipos { get; set; }
        public DbSet<Monstro> Monstros { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Index único para email
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Relacionamento Monstro -> Tipo
            modelBuilder.Entity<Monstro>()
                .HasOne(m => m.Tipo)
                .WithMany(t => t.Monstros)
                .HasForeignKey(m => m.TipoId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
